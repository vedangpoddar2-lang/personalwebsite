import { client } from '@/sanity/lib/client';

import PhotoCarousel from '@/components/PhotoCarousel';
import SpotlightCarousel from '@/components/SpotlightCarousel';
import Timeline from '@/components/Timeline';
import MiniExperience from '@/components/MiniExperience';
import HighlighterTag from '@/components/HighlighterTag';
import EducationList from '@/components/EducationList';
import { PortableText } from '@portabletext/react';
import { CustomPortableTextComponents } from '@/components/PortableTextComponents';
import styles from './page.module.css';

// Revalidate every 60 seconds
export const revalidate = 60;

async function getData() {
  const query = `{
    "profile": *[_type == "profile"][0],
    "work": *[_type == "workExperience"] | order(startDate desc) {
      ...,
      tags
    },
    "education": *[_type == "education"] | order(startDate desc) {
      ...,
      bentoCards[]{
        ...,
        _type == 'bentoCard' => {
          ...
        }
      },
      media[]{
        ...,
        asset->
      }
    },
    "highlights": *[_type == "highlight"] | order(order asc) {
      ...,
      link,
      image {
        ...,
        asset->
      }
    },
    "otherExperience": *[_type == "otherExperience"] | order(order asc) {
      ...
    }
  }`;
  return client.fetch(query);
}

export default async function Home() {
  const data = await getData();
  const { profile, work, education, highlights, otherExperience } = data;

  return (
    <main>


      <section className={`section ${styles.hero} animate-in`}>
        <div className={`container ${styles.heroContainer}`}>
          {profile?.photos && (
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              <PhotoCarousel photos={profile.photos} />
            </div>
          )}
          <div className={styles.intro}>
            <h1 className={styles.heroName}>
              {profile?.name || 'VEDANG_PODDAR'}
            </h1>
            {profile?.shortDescription && (
              <div className="portable-text">
                <PortableText value={profile.shortDescription} components={CustomPortableTextComponents} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      {highlights && highlights.length > 0 && (
        <section className="section animate-in">
          <div className="container">
            <SpotlightCarousel items={highlights} />
          </div>
        </section>
      )}

      <section className="section animate-in delay-1">
        <div className="container">
          <h2 className={styles.sectionTitle}>Professional Experience</h2>
          {work && work.length > 0 ? (
            <Timeline items={work} />
          ) : (
            <p className={styles.emptyState}>No work experience added yet.</p>
          )}
        </div>
      </section>

      {/* Other Experience Section */}
      {otherExperience && otherExperience.length > 0 && (
        <section className="section animate-in delay-2">
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h4 style={{ fontSize: '1.5rem', display: 'inline-block', margin: 0 }}>
                <HighlighterTag text="Other Contributions" />
              </h4>
            </div>
            <MiniExperience items={otherExperience} />
          </div>
        </section>
      )}

      <section className="section animate-in delay-2" style={{ backgroundColor: 'transparent' }}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Education</h2>
          {education && education.length > 0 ? (
            <EducationList items={education} />
          ) : (
            <p className={styles.emptyState}>No education details added yet.</p>
          )}
        </div>
      </section>
    </main>
  );
}
