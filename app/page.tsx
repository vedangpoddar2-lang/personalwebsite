import { client } from '@/sanity/lib/client';
import Navbar from '@/components/Navbar';
import PhotoCarousel from '@/components/PhotoCarousel';

import Timeline from '@/components/Timeline';
import EducationList from '@/components/EducationList';
import { PortableText } from '@portabletext/react';
import styles from './page.module.css';

// Revalidate every 60 seconds
export const revalidate = 60;

async function getData() {
  const query = `{
    "profile": *[_type == "profile"][0],
    "work": *[_type == "workExperience"] | order(startDate desc),
    "education": *[_type == "education"] | order(startDate desc) {
      ...,
      media[]{
        ...,
        asset->
      }
    }
  }`;
  return client.fetch(query);
}

export default async function Home() {
  const data = await getData();
  const { profile, work, education } = data;

  return (
    <main>
      <Navbar />

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
                <PortableText value={profile.shortDescription} />
              </div>
            )}
          </div>
        </div>
      </section>

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
