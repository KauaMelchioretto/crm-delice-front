import { Image } from 'antd';
import { useRef, useState } from 'react';

export const CrmAntImage = ({ src }: { src: string }) => {
    const [canPreview, setCanPreview] = useState(true);
    const startPos = useRef<{ x: number; y: number } | null>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
        startPos.current = { x: e.clientX, y: e.clientY };
        setCanPreview(true);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (startPos.current) {
            const dx = Math.abs(e.clientX - startPos.current.x);
            const dy = Math.abs(e.clientY - startPos.current.y);
            if (dx > 5 || dy > 5) {
                setCanPreview(false);
            }
        }
    };

    const handleMouseUp = () => {
        startPos.current = null;
    };

    return (
        <Image
            src={src}
            preview={canPreview}
            style={{ flex: 1 }}
            height={200}
            draggable={false}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        />
    );
};