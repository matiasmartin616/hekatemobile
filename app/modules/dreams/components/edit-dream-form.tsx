import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Alert } from "react-native";
import * as z from "zod";
import TextInput from "@modules/shared/components/form/text-input";
import FormButton from "@/app/modules/shared/components/form/form-button";
import { spacing } from "@/app/modules/shared/theme/theme";
import useDreamsApiMutations from "@modules/dreams/hooks/use-dreams-api";
import { Dream } from "../api/dreams";
import ImageCarouselInput from "@/app/modules/shared/components/form/image-carousel-input";
import ThemedView from "../../shared/components/themed-view";
import { useToast } from "../../shared/context/toast-context";

interface EditDreamFormProps {
    dream: Dream;
    setIsEditing: (isEditing: boolean) => void;
}

export default function EditDreamForm({ dream, setIsEditing }: EditDreamFormProps) {

    const formSchema = z.object({
        title: z.string().min(1, "Debe ser al menos 1 caracter"),
        text: z.string().min(1, "Debe ser al menos 1 caracter"),
        images: z.array(z.string()).optional(),
    });

    // Extract existing image URLs from dream
    const existingImageUrls = dream.images?.map(img => img.signedUrl || img.storageUrl) || [];

    const { control, handleSubmit, formState } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: dream.title,
            text: dream.text,
            images: existingImageUrls,
        },
        mode: "onChange",
    });
    const { updateDream } = useDreamsApiMutations();
    const { showToast } = useToast();
    const onSubmit = (data: z.infer<typeof formSchema>) => {
        updateDream.mutate({
            dreamId: dream.id,
            dream: data,
        }, {
            onSuccess: () => {
                setIsEditing(false);
                showToast(
                    "Sueño actualizado correctamente",
                    "success",
                );
            },
            onError: (error) => {
                Alert.alert("Error", error.message);
            }
        });
    }

    return (
        <ThemedView variant="transparent" style={{ flex: 1, padding: spacing.md, display: "flex", justifyContent: "space-between", flexDirection: "column", gap: spacing.md }}>
            <ThemedView>
                <TextInput
                    label="Título"
                    name="title"
                    control={control}
                    placeholder="Título de tu sueño"
                />

                <TextInput
                    label="Descripción"
                    name="text"
                    control={control}
                    placeholder="Descripción de tu sueño"
                />

                <ImageCarouselInput
                    label="Imágenes"
                    name="images"
                    control={control}
                    maxImages={2}
                    thumbSize={80}
                />
            </ThemedView>
            <FormButton
                formState={formState}
                handleSubmit={handleSubmit(onSubmit)}
                title="Editar sueño"
                variant="primary"
                loading={updateDream.isPending}
            />
        </ThemedView>
    );
}
