import React, { useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import themes from '@/app/_data/Themes'
import GradientBg from '@/app/_data/GradientBg';
import Style from '@/app/_data/Style';
import { Button } from '@/components/ui/button';


interface ControllerProps {
    selectTheme: (value: string) => void;
    selectBg: (value: string) => void;
    selectStyle: (value: string) => void;
    selectedUI: {
        selectedBg: string;
        selectedTheme: string;
        selectedStyle: string;
    }
}


function Controller({ selectTheme, selectBg, selectStyle, selectedUI }: ControllerProps) {
    const [showBgMore, setshowBgMore] = useState(6)
    const [showStyleMore, setshowStyleMore] = useState(6)
    // 找到匹配的主题色对象
    const placeholderTheme = (themes.find(theme => theme.theme === selectedUI.selectedTheme)?.theme);
    return (
        <div>
            {/* theme selection Controller */}
            <h2>Themes</h2>
            <Select onValueChange={(value) => selectTheme(value)}>
                <SelectTrigger className='w-full mt-5'>
                    <SelectValue placeholder={placeholderTheme ? placeholderTheme : 'Select a theme'} />
                </SelectTrigger>
                <SelectContent className='overflow-y-auto max-h-[200px]'>
                    {themes.map((item, index) => (
                        <SelectItem key={index} value={item.theme}>
                            <div className='flex '>
                                <div className='h-5 w-5 rounded-l-md' style={{ backgroundColor: item.primary }}>
                                </div>
                                <div className='h-5 w-5' style={{ backgroundColor: item.secondary }}>
                                </div>
                                <div className='h-5 w-5' style={{ backgroundColor: item.accent }}>
                                </div>
                                <div className='h-5 w-5 rounded-r-md' style={{ backgroundColor: item.neutral }}>
                                </div>
                                <div className='ml-2 '>
                                    {item.theme}</div>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* background selection Controller */}
            <h2 className='mt-8 my-3'>Background</h2>
            <div className='grid grid-cols-3 rounded-md gap-3 '>
                {GradientBg.map((item, index) => (index < showBgMore) && (
                    <div key={index} onClick={() => selectBg(item.gradient)}>
                        <div className='w-full h-[50px] rounded-md hover:border hover:border-black border-2 flex items-center justify-center text-sm text-gray-400 ' style={{
                            transform: selectedUI.selectedBg === item.gradient ? 'scale(1.2)' : 'none',
                            transition: 'transform 0.3s ease', background: item.gradient
                        }}>
                            {index == 0 && 'none'}
                        </div>
                    </div>
                ))}
            </div>
            <Button variant='ghost' size='sm' className='mt-3 w-full col-span-3 border' onClick={() => setshowBgMore(showBgMore > 6 ? 6 : 100)}>{showBgMore > 6 ? 'Fold' : 'Show More'}</Button>

            {/* style selection Controller */}
            <h2 className='mt-8 my-3'>Style</h2>
            <div className='grid grid-cols-3 gap-3'>
                {Style.map((item, index) => index < showStyleMore && (
                    <div key={index} onClick={() => selectStyle(item.name)}>
                        <div className='cursor-pointer hover:border-2 rounded-lg' >
                            <img src={item.img} width={600} height={80} alt="" className='rounded-lg' />
                        </div>
                        <h2 className='text-center'> {item.name}</h2>
                    </div>
                ))}

            </div>
            <Button variant='ghost' size='sm' className='mt-3 w-full col-span-3 border' onClick={() => setshowStyleMore(showStyleMore > 6 ? 6 : 100)}>{showStyleMore > 6 ? 'Fold' : 'Show More'}</Button>
        </div>

    )
}

export default Controller