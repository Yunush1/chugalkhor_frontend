import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { loginWithPassword, registerWithPassword, validateToken } from "../authService";
import { navigateTo } from "../navigation/navigationRef";

export const useLogin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: loginWithPassword,

        onSuccess: (res) => {
            const { user, accessToken } = res.data;
            sessionStorage.setItem("token", accessToken);

            queryClient.setQueryData(["auth"], {
                user,
                token: accessToken
            });

            navigateTo("/");
        }
    });
};


export const useRegister = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: registerWithPassword,

        onSuccess: (res) => {
            const { user, accessToken } = res;
            sessionStorage.setItem("token", accessToken);
            console.log('register ',res)
            queryClient.setQueryData(["auth"], {
                user,
                token: accessToken
            });

            navigateTo("/");
        }
    });
};

export const useValidateToken = () => {
    return useQuery({
        queryKey: ["auth"],
        queryFn: validateToken,
        retry: false,
        enabled: true, // ❗ prevent auto call

        select: (res) => {
            return {
                user: res.user,
                token: res.accessToken
            };
        },
        onSuccess: () => {
            navigateTo("/");
        },


        onError: () => {
            navigateTo("/register");
        }
    });
};