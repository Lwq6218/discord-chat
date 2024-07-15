import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

interface Props {
  imgUrl: string;
  alt: string;
  value: number | string;
  title?: string;
  href?: string;
  textStyles?: string;
  isAuthor?: boolean;
}
export default function Metric({
  imgUrl,
  alt,
  value,
  title,
  href,
  textStyles,
  isAuthor,
}: Props) {
  const { t } = useTranslation();
  const metricOntent = (
    <>
      <img
        src={imgUrl}
        width={16}
        height={16}
        alt={alt}
        className={`object-contain ${href ? 'rounded-full' : ' '}`}
      />
      <p className={`${textStyles} flex items-center gap-1`}>
        {value}
        <span
          className={`small-regular line-clamp-1 ${
            isAuthor ? 'max-sm:hidden' : ''
          }`}
        >
          {t(title || '')}
        </span>
      </p>
    </>
  );
  if (href) {
    return (
      <Link to={href} className="flex-center gap-1">
        {metricOntent}
      </Link>
    );
  }
  return <div className="flex-center flex-wrap gap-1">{metricOntent}</div>;
}
