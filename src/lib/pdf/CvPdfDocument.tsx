import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import { SECTION_LABELS, type CvDocument, type UniversityTemplate } from '@/types/cv';

function getTheme(template: UniversityTemplate) {
  const isSerif =
    template.layoutVariant === 'classic-serif' ||
    template.layoutVariant === 'academic-cv';
  const fontFamily = isSerif ? 'NotoSerif' : 'Inter';
  const headerCentered = template.layoutVariant === 'classic-serif';
  const accent = template.accentColor || '#1e293b';

  return StyleSheet.create({
    page: {
      fontFamily,
      fontSize: 9.5,
      lineHeight: 1.4,
      color: '#111827',
      paddingTop: 34,
      paddingBottom: 34,
      paddingHorizontal: 38,
      backgroundColor: '#FFFFFF',
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: headerCentered ? 'center' : 'space-between',
      alignItems: 'center',
      borderBottomWidth: template.layoutVariant === 'modern-tech' ? 1.5 : 0.75,
      borderBottomColor:
        template.layoutVariant === 'classic-serif' ? '#111827' : accent,
      paddingBottom: 8,
      marginBottom: 10,
    },
    headerTextBlock: {
      flex: 1,
      alignItems: headerCentered ? 'center' : 'flex-start',
    },
    fullName: {
      fontSize: 17,
      fontWeight: 700,
      color: template.layoutVariant === 'classic-serif' ? '#111827' : accent,
      marginBottom: 2,
    },
    headline: {
      fontSize: 10,
      color: '#374151',
      marginBottom: 3,
    },
    contactLine: {
      fontSize: 8.5,
      color: '#4B5563',
    },
    photo: {
      width: 56,
      height: 56,
      borderRadius: template.layoutVariant === 'clean-euro' ? 4 : 28,
      marginLeft: 12,
      objectFit: 'cover',
    },
    section: {
      marginBottom: 9,
    },
    sectionHeading: {
      fontSize: 10.5,
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: 0.6,
      color: template.layoutVariant === 'classic-serif' ? '#111827' : accent,
      borderBottomWidth: 0.75,
      borderBottomColor: '#D1D5DB',
      paddingBottom: 2,
      marginBottom: 5,
    },
    itemBlock: {
      marginBottom: 5,
    },
    itemHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
    },
    itemTitle: {
      fontSize: 9.8,
      fontWeight: 700,
      color: '#111827',
    },
    itemDate: {
      fontSize: 8.8,
      color: '#4B5563',
    },
    itemSubRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: 2,
    },
    itemSubtitle: {
      fontSize: 9.2,
      fontStyle: isSerif ? 'italic' : 'normal',
      color: '#374151',
    },
    itemLocation: {
      fontSize: 8.6,
      color: '#6B7280',
    },
    bulletRow: {
      flexDirection: 'row',
      paddingLeft: 8,
      marginBottom: 1.8,
    },
    bulletDot: {
      width: 10,
      fontSize: 9,
      color: '#374151',
    },
    bulletText: {
      flex: 1,
      fontSize: 9.2,
      color: '#1F2937',
    },
  });
}

export function CvPdfDocument({
  cv,
  template,
}: {
  cv: CvDocument;
  template: UniversityTemplate;
}) {
  const styles = getTheme(template);
  const { personalInfo, sections } = cv.content;
  const visibleSections = sections.filter((s) => s.visible);
  const contactParts = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
    ...personalInfo.links,
  ].filter(Boolean);

  return (
    <Document title={cv.title} author={personalInfo.fullName}>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View style={styles.headerTextBlock}>
            <Text style={styles.fullName}>{personalInfo.fullName}</Text>
            {personalInfo.headline ? (
              <Text style={styles.headline}>{personalInfo.headline}</Text>
            ) : null}
            {contactParts.length > 0 ? (
              <Text style={styles.contactLine}>{contactParts.join('  |  ')}</Text>
            ) : null}
          </View>
          {cv.showPhoto && personalInfo.photoDataUrl ? (
            <Image src={personalInfo.photoDataUrl} style={styles.photo} />
          ) : null}
        </View>

        {visibleSections.map((section) => {
          const heading = section.title || SECTION_LABELS[cv.language][section.type];
          return (
            <View key={section.id} style={styles.section}>
              <Text style={styles.sectionHeading}>{heading}</Text>
              {section.items.map((item) => (
                <View key={item.id} style={styles.itemBlock}>
                  {item.title || item.dateRange ? (
                    <View style={styles.itemHeaderRow}>
                      <Text style={styles.itemTitle}>{item.title}</Text>
                      {item.dateRange ? (
                        <Text style={styles.itemDate}>{item.dateRange}</Text>
                      ) : null}
                    </View>
                  ) : null}
                  {item.subtitle || item.location ? (
                    <View style={styles.itemSubRow}>
                      <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                      {item.location ? (
                        <Text style={styles.itemLocation}>{item.location}</Text>
                      ) : null}
                    </View>
                  ) : null}
                  {item.bullets
                    .filter((b) => b.trim().length > 0)
                    .map((bullet, idx) => (
                      <View key={idx} style={styles.bulletRow}>
                        <Text style={styles.bulletDot}>•</Text>
                        <Text style={styles.bulletText}>{bullet}</Text>
                      </View>
                    ))}
                </View>
              ))}
            </View>
          );
        })}
      </Page>
    </Document>
  );
}
