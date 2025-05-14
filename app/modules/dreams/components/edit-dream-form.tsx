import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Alert, Button, View } from "react-native";
import * as z from "zod";
import TextInput from "@modules/shared/components/form/text-input";
import ThemedText from "@/app/modules/shared/components/themed-text";
import FormButton from "@/app/modules/shared/components/form/form-button";
import colors from "@/app/modules/shared/theme/theme";
import useDreamsApiMutations from "@modules/dreams/hooks/use-dreams-api";
import { useModal } from "@/app/modules/shared/context/modal-context";
import { Dream } from "../api/dreams";

interface EditDreamFormProps {
    dream: Dream;
}

export default function EditDreamForm({ dream }: EditDreamFormProps) {

    const formSchema = z.object({
        title: z.string().min(1, "Debe ser al menos 1 caracter"),
        text: z.string().min(1, "Debe ser al menos 1 caracter"),
    });

    const { control, handleSubmit, formState } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: dream.title,
            text: dream.text,
        },
        mode: "onChange",
    });
    const { closeModal } = useModal();
    const { updateDream } = useDreamsApiMutations();

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        updateDream.mutate({
            dreamId: dream.id,
            dream: data,
        }, {
            onSuccess: () => {
                closeModal();
            },
            onError: (error) => {
                Alert.alert("Error", error.message);
            }
        });
    }

    return (
        <View>
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

            <FormButton formState={formState} handleSubmit={handleSubmit(onSubmit)}>
                <ThemedText style={{ color: colors.light.neutral.white }}>Editar sueño</ThemedText>
            </FormButton>
        </View>
    );
}
