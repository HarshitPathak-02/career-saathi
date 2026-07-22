import { useEffect } from "react";

import {
    useRefreshMutation,
    useLazyMeQuery,
} from "../api/authApi";

import { useAppDispatch } from "../../../app/hooks";

import {
    setCredentials,
    clearCredentials,
    setInitialized,
} from "../slice/authSlice";

interface Props {
    children: React.ReactNode;
}

const AuthInitializer = ({
    children,
}: Props) => {
    const dispatch = useAppDispatch();

    const [refresh] = useRefreshMutation();

    const [getMe] = useLazyMeQuery();

    useEffect(() => {
        const initialize = async () => {
            try {
                // Refresh token
                const refreshResponse =
                    await refresh().unwrap();

                console.log("Refresh:", refreshResponse);

                dispatch(
                    setCredentials({
                        accessToken:
                            refreshResponse.data.accessToken,
                    })
                );

                console.log("Token stored");

                // Fetch user
                const meResponse =
                    await getMe().unwrap();

                console.log("Me:", meResponse);

                dispatch(
                    setCredentials({
                        accessToken:
                            refreshResponse.data.accessToken,

                        user: meResponse.data,
                    })
                );


                console.log("User stored");
                console.log("Initialized");
            } catch {
                dispatch(clearCredentials());
            } finally {
                dispatch(setInitialized(true));
            }
        };

        initialize();
    }, [dispatch, refresh, getMe]);

    return <>{children}</>;
};

export default AuthInitializer;