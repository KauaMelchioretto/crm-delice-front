import {useAtom, useAtomValue} from "jotai/index";
import CrmState from "../../../../utils/state/CrmState.ts";
import {CrmFormType} from "../../../../utils/entities/entities.ts";
import {CrmModal} from "../../../../utils/components/core/CrmModal.tsx";
import {useEffect} from "react";
import {kanbanUseCase} from "../../usecase/kanbanUseCase.ts";

export const CardDialog = () => {
    const [formType, setFormType] = useAtom(CrmState.FormType);
    const cardUUID = useAtomValue(CrmState.EntityFormUUID);

    switch (formType) {
        case CrmFormType.EMPTY:
            return <></>;
        case CrmFormType.READ_CARD:
            return (
                <CrmModal
                    open={true}
                    onClose={() => setFormType(CrmFormType.EMPTY)}
                >
                    <CardDialogInfo cardUUID={cardUUID}/>
                </CrmModal>
            )
    }
}
const CardDialogInfo = ({cardUUID}: { cardUUID: string }) => {
    useEffect(() => {
        kanbanUseCase.getCardByUUID(cardUUID).then((response) => {
            console.log(response)
        })
    }, [cardUUID]);

    return <div>{cardUUID}</div>
}