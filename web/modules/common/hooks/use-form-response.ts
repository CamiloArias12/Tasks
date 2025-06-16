import { useEffect } from 'react';
import { CommonActionState } from '../types/action';
import { toast } from 'sonner';

export type UseFormResponseProps = {
    response: CommonActionState;
    onSuccess?: (data: any) => void;
    onFailed?: () => void;
    onEnd?: () => void;
};

export function useFormResponse(props: UseFormResponseProps) {
    useEffect(() => {
        const errors = props.response?.errors;
        const messages = props.response?.messages;
        if (errors?.length == 0) return;

        if (errors && errors.length > 0) {
            errors.forEach(error => error?.forEach(e => toast.error(e)));
            props.onFailed && props.onFailed();
        }

        if (messages && messages.length > 0) {
            messages.forEach(msg => toast.success(msg));
            props.onSuccess && props.onSuccess(props.response.data);
        }

        props.onEnd && props.onEnd();
    }, [props.response]);
}
