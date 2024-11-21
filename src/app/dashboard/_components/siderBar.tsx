import { ChartLine, CircleFadingArrowUp, MessageCircleMore, NotepadTextDashed } from 'lucide-react'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress"

function SiderBar() {
    const menuList = [
        {
            id: 1,
            name: 'My Forms',
            icon: NotepadTextDashed,
            path: '/dashboard'
        },
        {
            id: 2,
            name: 'Responses',
            icon: MessageCircleMore,
            path: '/dashboard/responses'
        },
        {
            id: 3,
            name: 'Analytics',
            icon: ChartLine,
            path: '/dashboard/analytics'
        },
        {
            id: 4,
            name: 'Upgrade',
            icon: CircleFadingArrowUp,
            path: '/dashboard/upgrade'
        }
    ]

    const path = usePathname()
    useEffect(() => {
        console.log(path);
    }, [path])
    return (
        <div className='h-screen border shadow pt-5'>{
            menuList.map((item) => {
                return (
                    <div key={item.id} className='p-2 '>
                        <div onClick={() => { console.log('clicked', path, item.path, path === item.path) }} className={`flex items-center gap-5 p-4 rounded-lg  cursor-pointer  ${path === item.path ? 'bg-primary text-white hover:text-white hover:bg-primary' : 'hover:text-gray-600 hover:bg-gray-100'}`}>
                            <item.icon className='w-5 h-5' />
                            <p>{item.name}</p>
                        </div>
                    </div>
                )
            })
        }
            <div className='fixed items-center w-64 bottom-2 px-6'>
                {/* <Button className='w-full'> + Create From</Button> */}
                <div className='mt-5 h-1'>
                    <Progress value={33} />
                </div>
                <h2 className='text-gray-400 mt-5'><strong>2</strong> out of <strong>3</strong> files are created</h2>
                <hr className='mt-2 mb-2'/>
                <h2 className='text-xs text-gray-400 mt-2'> upgrade your plan for unlimited AI form builder</h2>
            </div>
        </div>
    )
}

export default SiderBar