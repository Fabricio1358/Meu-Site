// src/components/layout/DocLayout/index.tsx
import './DocLayout.css';
import { useEffect, useRef, useState } from 'react';

import type DocLayoutType from '@/types/DocLayoutType';

interface DocLayoutProps {
     date: string;
     title: string;
     description: string;
     sections?: DocLayoutType[];
}

const slugify = (text: string) =>
     text
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^\w\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-');

const DocLayout = ({ date, title, description, sections = [] }: DocLayoutProps) => {
     const [activeSection, setActiveSection] = useState<string>('');
     const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

     useEffect(() => {
          if (!sections.length) return;

          const observer = new IntersectionObserver(
               (entries) => {
                    entries.forEach((entry) => {
                         if (entry.isIntersecting) {
                              setActiveSection(entry.target.id);
                         }
                    });
               },
               {
                    root: null,
                    rootMargin: '0px 0px -70% 0px',
                    threshold: 0.1,
               }
          );

          sections.forEach((section) => {
               const id = slugify(section.subTitle);
               const element = sectionRefs.current[id];
               if (element) observer.observe(element);
          });

          return () => observer.disconnect();
     }, [sections]);

     return (
          <main className='docLayout-main'>
               <div className='docLayout-content'>
                    <span className='docLayout-date'>{date}</span>
                    <h1>{title}</h1>
                    <p>{description}</p>

                    {sections.map((section) => {
                         const slug = slugify(section.subTitle);

                         return (
                              <div
                                   key={slug}
                                   id={slug}
                                   className='docLayout-section'
                                   ref={(el) => {
                                        if (el) sectionRefs.current[slug] = el;
                                        else delete sectionRefs.current[slug];
                                   }}
                              >
                                   <h2>{section.subTitle}</h2>
                                   <p>{section.content}</p>
                              </div>
                         );
                    })}
               </div>

               <div className='docLayout-topics'>
                    <h5>CONTENTS</h5>

                    {sections.map((section) => {
                         const slug = slugify(section.subTitle);
                         return (
                              <div
                                   key={slug}
                                   className={
                                        'docLayout-topics-item' + (activeSection === slug ? ' active' : '')
                                   }
                              >
                                   <a href={`#${slug}`}>
                                        <h4>{section.subTitle}</h4>
                                   </a>
                              </div>
                         );
                    })}
               </div>
          </main>
     );
};

export default DocLayout;
