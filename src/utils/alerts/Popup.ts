import Swal, { SweetAlertIcon } from "sweetalert2";

class Popup {
    async popup(
        icon: SweetAlertIcon,
        title: string,
        text: string,
        buttonText: string
    ) {
        return Swal.fire({
            icon: icon,
            title: title,
            text: text,
            confirmButtonText: buttonText,
            reverseButtons: true,
        });
    }

    async toast(icon: SweetAlertIcon, message: string, time: number) {
        return Swal.mixin({
            toast: true,
            position: "top-start",
            showConfirmButton: false,
            timer: time,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener("mouseenter", Swal.stopTimer);
                toast.addEventListener("mouseleave", Swal.resumeTimer);
            },
            showCloseButton: true,
        }).fire({
            icon: icon,
            title: message,
        });
    }

    async confirm(
        icon: SweetAlertIcon,
        title: string,
        text: string,
        buttonText: string
    ) {
        return Swal.fire({
            icon: icon,
            text: text,
            title: title,
            confirmButtonText: buttonText,
            showCancelButton: true,
            reverseButtons: true,
        });
    }
}

export const popup = new Popup();
