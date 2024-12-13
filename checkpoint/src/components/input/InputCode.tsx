import {
    ControllerRenderProps,
} from "react-hook-form";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { z } from "zod";

const InputCode = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    field: ControllerRenderProps<z.infer<any>, "pin">
) => {
    return (
        <InputOTP maxLength={6} {...field}>
            <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
            </InputOTPGroup>
        </InputOTP>
    );
};

export default InputCode