import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import Modal from '../../Modal';

function CardSprintBacklog({ data, index, listIndex, dataEntrega }) {  
    const [modalAtivo, setModalAtivo] = useState(false);    

    const [{ isDragging }, dragRef] = useDrag({
        item: { type: 'CARD_SPRINT_BACKLOG', index, listIndex, data },
            collect: monitor => ({
            isDragging: monitor.isDragging(),        
        }),        
    });   

    const containerBaseClasses = "relative bg-[#FFF] rounded-[5px] mb-[10px] text-black p-[15px] shadow-[0_1px_4px_0_rgba(192,208,230,0.8)] border-t-[20px] border-t-[rgba(230,236,245,0.4)] [&_img]:w-[24px] [&_img]:h-[24px] [&_img]:rounded-[2px] [&_img]:mt-[5px]";
    const containerDraggingClasses = "border-2 border-dashed border-[rgba(0,0,0,0.2)] pt-[31px] rounded-none bg-transparent shadow-none cursor-grabbing [&_p]:opacity-0 [&_img]:opacity-0 [&_span]:opacity-0";

    return (
        <div 
            ref={dragRef} 
            className={`${containerBaseClasses} ${isDragging ? containerDraggingClasses : ''}`} 
            onClick={()=> setModalAtivo(!modalAtivo)}
        >
            <header className="absolute -top-[22px]">
                {data.labels.map(label => (
                    <span 
                        key={label} 
                        className="w-[10px] h-[10px] rounded-[2px] inline-block" 
                        style={{ backgroundColor: label }} 
                    />
                ))}
                <span id="ocorrencia" className="ml-[10px]">{`Cod. Ocorrencia: ${data.ocorrencia}`}</span>
            </header>
            <h3>{data.titulo}</h3> 
            <Modal activate={modalAtivo} setActivate={setModalAtivo} altura={400} largura={500} >
                <div className={containerBaseClasses}>
                    <h3>{data.titulo}</h3>
                    <h3>{new Date(dataEntrega).toLocaleDateString()}</h3>
                    <p className="font-medium text-justify whitespace-pre-wrap w-full">
                        {data.content}
                    </p>
                </div>
            </Modal>          
        </div>
    );
}

export default CardSprintBacklog;