import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Alert, Button, View } from "react-native";
import * as z from "zod";
import TextInput from "@modules/shared/components/form/text-input";
import ThemedText from "@/app/modules/shared/components/themed-text";
import FormButton from "@/app/modules/shared/components/form/form-button";
import FormNumberInput from "@/app/modules/shared/components/form/number-input";
import colors from "@/app/modules/shared/theme/theme";
import useDreamsApiMutations from "@modules/dreams/hooks/use-dreams-api";
import { useModal } from "@/app/modules/shared/context/modal-context";

export default function CreateDreamForm() {

    const formSchema = z.object({
        title: z.string().min(1, "Debe ser al menos 1 caracter"),
        text: z.string().min(1, "Debe ser al menos 1 caracter"),
    });

    const { control, handleSubmit, formState } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            text: "",
        },
        mode: "onChange",
    });
    const { closeModal } = useModal();
    const { createDream } = useDreamsApiMutations();

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        createDream.mutate(data, {
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
                <ThemedText style={{ color: colors.light.neutral.white }}>Crear sueño</ThemedText>
            </FormButton>
        </View>
    );
}
