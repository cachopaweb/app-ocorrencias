import React from 'react';
import { useDrag } from 'react-dnd';

function CardsKanban({ data, index, listIndex, color }) {
    const [{ isDragging }, dragRef] = useDrag({
        item: { type: 'CARD_OCORRENCIA', index, listIndex, data },
        collect: monitor => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const containerClasses = [
        'relative',
        'mb-[10px]',
        'text-black',
        'p-[15px]',
        'hover:-translate-y-[2px]',
        'transition-transform',
        isDragging 
            ? 'border-2 border-dashed border-black/20 pt-[31px] rounded-none bg-transparent shadow-none cursor-grabbing [&>p]:opacity-0 [&>img]:opacity-0 [&>span]:opacity-0' 
            : 'rounded-[5px] shadow-[0_1px_4px_0_rgba(192,208,230,0.8)] border-t-[20px] border-t-[rgba(230,236,245,0.4)]'
    ].filter(Boolean).join(' ');

    return (
        <div 
            ref={dragRef} 
            className={containerClasses}
            style={!isDragging ? { backgroundColor: color || '#FFF' } : undefined}
        >
            {data?.labels?.map(label => (
                <span 
                    key={label} 
                    className="w-[10px] h-[10px] rounded-[2px] inline-block" 
                    style={{ backgroundColor: label }} 
                />
            ))}
            <header className="absolute -top-[22px]">
                <h4>{data?.titulo}</h4>
            </header>
            <p className="conteudo font-medium text-justify whitespace-pre-wrap w-full">{data?.content}</p>
            <br />
            <p className="font-medium text-justify whitespace-pre-wrap w-full">
                <strong className="text-[gray]">{data?.user}</strong>
            </p>
        </div>
    );
}

export default CardsKanban;