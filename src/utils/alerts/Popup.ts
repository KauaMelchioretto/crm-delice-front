import Swal, {SweetAlertIcon, SweetAlertTheme} from "sweetalert2";

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
            theme: this.getTheme() as SweetAlertTheme
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
            theme: this.getTheme() as SweetAlertTheme
        }).fire({
            icon: icon,
            title: message,
        });
    }

    async confirm(
        icon: SweetAlertIcon,
        title: string,
        text: string,
        confirm: string,
        cancel?: string
    ) {
        return Swal.fire({
            icon: icon,
            text: text,
            title: title,
            confirmButtonText: confirm,
            cancelButtonText: cancel ?? "Cancel",
            showCancelButton: true,
            reverseButtons: true,
            theme: this.getTheme() as SweetAlertTheme
        });
    }

    getTheme(): string {
        const theme = localStorage.getItem("joy-mode")

        if (!theme) return "light"

        return theme
    }
}

export const popup = new Popup();
