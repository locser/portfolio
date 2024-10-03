import React from 'react'
import { BentoGrid, BentoGridItem } from './ui/BentoGrid'
import { gridItems } from '@/data'

export interface GridItem {
 id: number;
 title: string;
 description: string;
 className: string;
 imgClassName: string;
 titleClassName: string;
 img: string;
 spareImg: string;
}

const Grid = () => {
 return (
  <section id="about">
   <BentoGrid>
    {
     gridItems.map((item: GridItem) => (
      <BentoGridItem
       id={item.id}
       key={item.id}
       title={item.title}
       description={item.description}
       className={item.className}
       icon={undefined}
       img={item.img}
       spareImg={item.spareImg}
       header={undefined}
       imgClassName={item.imgClassName}
       titleClassName={item.titleClassName}
      />
     ))
    }
   </BentoGrid>

  </section>
 )
}

export default Grid
