import { isAxiosError } from "axios";
import toast from "react-hot-toast";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function axiosErrorHandler<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    errorMessage = "Something went wrong!",
    successMessage = "Action successfully completed"
) {
    return (async (...args: Parameters<T>): Promise<Awaited<ReturnType<T>> | undefined> => {
        try {
            const res = await fn(...args);
            if (successMessage.length > 0) {
                toast.success(successMessage);
            }
            return res;
        } catch (e) {
            if (isAxiosError(e)) {
                toast.error(e.response?.data.message || e.message);
            } else {
                toast.error(errorMessage);
            }
            return undefined;
        }
    }) as (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>> | undefined>;
}
