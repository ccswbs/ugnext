import { Section as SectionComponent } from '@/components/section';
import { Heading } from '@/components/heading';
import { WidgetSelector } from '@/components/widgets/widget-selector';
import { getHeadingLevel } from '@/lib/string-utils';

export const Section = ({ data }) => {
  const primary = [];
  const secondary = [];
  const others = [];

  data?.content?.forEach((widget, index) => {
    switch (widget?.sectionColumn?.name?.toLowerCase()) {
      case 'primary':
        primary.push(<WidgetSelector key={index} data={widget} />);
        break;
      case 'secondary':
        secondary.push(<WidgetSelector key={index} data={widget} />);
        break;
      default:
        others.push(<WidgetSelector key={index} data={widget} />);
        break;
    }
  });

  return (
    <>
      {data.heading && <Heading level={getHeadingLevel(data.headingLevel) ?? 1}>{data.heading}</Heading>}

      {(primary.length > 0 || secondary.length > 0) && <SectionComponent primary={primary} secondary={secondary} />}

      {others.length > 0 && <div className="w-full text-center">{...others}</div>}
    </>
  );
};