import { Statistics as StatisticsComponent } from '@/components/statistics';
import { HtmlParser } from '@/components/html-parser';
import { twJoin } from 'tailwind-merge';

export const Statistics = ({ data }) => (
  <StatisticsComponent
    data={data?.content.map((statistic) => {
      return {
        image: statistic?.image?.image,
        value: (
          <div className="flex flex-col gap-3">
            {statistic?.fontAwesomeIcon && <i className={twJoin(statistic.fontAwesomeIcon, 'fa-2x')}></i>}
            <span>{statistic.value}</span>
          </div>
        ),
        represents: (
          <>
            <HtmlParser html={statistic.represents.processed} />
          </>
        ),
      };
    })}
    variant={data?.style?.name?.toLowerCase().replace(/\s/g, '-')}
  />
);
