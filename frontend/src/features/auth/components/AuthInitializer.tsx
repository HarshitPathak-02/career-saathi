import { useEffect } from "react";

import { useRefreshMutation } from "../api/authApi";

import { useAppDispatch } from "../../../app/hooks";

import { setCredentials } from "../slice/authSlice";

interface Props {
    children: React.ReactNode;
}

const AuthInitializer = ({
    children,
}: Props) => {

    const dispatch =
        useAppDispatch();

    const [
        refresh,
        {
            isLoading,
        },
    ] = useRefreshMutation();

    useEffect(() => {

        const initialize =
            async () => {

                try {

                    const response =
                        await refresh().unwrap();

                    dispatch(
                        setCredentials(
                            response.data
                        )
                    );

                } catch {

                    // User not logged in

                }
            };

        initialize();

    }, []);

    if (isLoading) {

        return <>Loading...</>;
    }

    return children;
};

export default AuthInitializer;