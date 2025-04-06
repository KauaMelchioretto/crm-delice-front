import {useRef, useState, useEffect, ImgHTMLAttributes} from "react";
import {Skeleton} from "@mui/joy";
import noImage from "../../assets/images/no-image.svg";

export const Image = (props: ImgHTMLAttributes<HTMLImageElement>) => {
    const [show, setShow] = useState(false)
    const imageRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(onIntersection, {
            rootMargin: "500px",
            threshold: 0.5,
        });

        const showImage = (image: HTMLImageElement) => {
            if (image.dataset.src) {
                image.src = image.dataset.src;
                observer.unobserve(image);
            }
        };

        function onIntersection(entries: IntersectionObserverEntry[]) {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    showImage(entry.target as HTMLImageElement);
                    setShow(true);
                }
            });
        }

        if (imageRef?.current) {
            observer.observe(imageRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, []);

    if (!show) {
        return (
            <Skeleton
                ref={imageRef}
                width={props?.style?.width ?? "100%"}
                height={props?.style?.height ?? "100%"}
            />
        );
    }

    return (
        <img
            style={props?.style}
            src={props?.src ? props?.src : noImage}
            alt={props?.alt}
            onError={(e) => {
                (e.target as HTMLImageElement).src = noImage;
            }}
        />
    );
}