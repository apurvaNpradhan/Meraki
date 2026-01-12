import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { ResponsiveModalFooter, ResponsiveModalHeader, ResponsiveModalTitle } from "@/components/ui/responsive-modal";
import { useModal } from "@/stores/modal.store";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
import { env } from "@meraki/env/web";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { IconCamera, IconLoader2 } from "@tabler/icons-react";

const newOrganizationSchema = z.object({
	name: z.string().min(2, {
		message: "Organization name must be at least 2 characters.",
	}),
	slug: z.string().min(2, {
		message: "Slug must be at least 2 characters.",
	}),
  logo: z.string().optional(),
});

type NewOrganizationValues = z.infer<typeof newOrganizationSchema>;

function NewOrganizationModal() {
  const {close}=useModal()
	const { mutateAsync: upload } = useMutation(orpc.upload.mutationOptions());
	const navigate = useNavigate();
  const [loadingLogo,setLoadingLogo]=useState(false)
	const form = useForm<NewOrganizationValues>({
		resolver: zodResolver(newOrganizationSchema),
		defaultValues: {
      
			name: "",
			slug: "",
      logo:""
		},
	});
const handleLogoChange=async(e:React.ChangeEvent<HTMLInputElement>)=>{
  const file=e.target.files?.[0]
  if(!file) return;
  setLoadingLogo(true)
  try{
    const {url}=await upload({file})
    const absoluteUrl=`${env.VITE_SERVER_URL}${url}`
    form.setValue("logo",absoluteUrl)
  }catch(error){
    toast.error("Failed to upload logo")
  }finally{
    setLoadingLogo(false)
  }
}
	async function onSubmit(values: NewOrganizationValues) {
		const { data, error } = await authClient.organization.create({
			name: values.name,
			logo:values.logo,
			slug: values.slug,
		});

		if (error) {
			toast.error(error.message);
			return;
		}

		await authClient.organization.setActive({
			organizationId: data.id,
		});


		toast.success("Organization created successfully");
    close()
	}

	return (
		<div className="flex flex-col gap-6 p-1">
				<ResponsiveModalHeader>
					<ResponsiveModalTitle>Create a new organization</ResponsiveModalTitle>
				</ResponsiveModalHeader>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col gap-4"
					>
            <div className="flex flex-row items-center gap-2">
              						<div className="group relative cursor-pointer">
							<Avatar className="h-10 w-10">
								<AvatarImage src={form.getValues("logo") || ""} />
								<AvatarFallback className="text-lg">
									{form.getValues("name")?.charAt(0) || "U"}
								</AvatarFallback>
							</Avatar>
							<label
								htmlFor="avatar-upload"
								className={cn(
									"absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-background-foreground/40 opacity-0 transition-opacity group-hover:opacity-100",
									loadingLogo && "cursor-not-allowed opacity-100",
								)}
							>
								{loadingLogo ? (
									<IconLoader2 className="h-6 w-6 animate-spin text-accent" />
								) : (
									<IconCamera className="h-6 w-6 text-accent" />
								)}
							</label>
							<Input
								id="avatar-upload"
								type="file"
								className="hidden"
								accept="image/*"
								onChange={handleLogoChange}
								disabled={loadingLogo}
							/>
						</div>

            </div>
						<Controller
							control={form.control}
							name="name"
							render={({ field, fieldState }) => (
								<div>
									<Input
										{...field}
										placeholder="Organization Name"
										className="border-none bg-transparent px-0 py-2 font-semibold shadow-none placeholder:opacity-30 focus-visible:ring-0 md:text-xl dark:bg-transparent"
										autoFocus
										onChange={(e) => {
											field.onChange(e);
											// Auto-generate slug from name if slug hasn't been manually edited
											if (!form.formState.dirtyFields.slug) {
												const slug = e.target.value
													.toLowerCase()
													.replace(/[^a-z0-9]+/g, "-")
													.replace(/(^-|-$)+/g, "");
												form.setValue("slug", slug, { shouldValidate: true });
											}
										}}
									/>
									{fieldState.error && (
										<FieldError errors={[fieldState.error]} />
									)}
								</div>
							)}
						/>

						<Controller
							control={form.control}
							name="slug"
							render={({ field, fieldState }) => (
								<div>
									<div className="flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-1">
										<span className="text-muted-foreground text-sm">
											meraki.com/
										</span>
										<Input
											{...field}
											placeholder="slug"
											className="h-7 border-none bg-transparent p-0 shadow-none focus-visible:ring-0"
										/>
									</div>
									{fieldState.error && (
										<FieldError errors={[fieldState.error]} />
									)}
								</div>
							)}
						/>
            <ResponsiveModalFooter>
						<Button
							type="submit"
							className="mt-4 w-full"
							disabled={form.formState.isSubmitting}
						>
							Create Workspace
						</Button>
             
            </ResponsiveModalFooter>
					</form>
		</div>
	);
}

export default NewOrganizationModal
