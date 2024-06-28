import '@fortawesome/fontawesome-svg-core/styles.css';
import { library, config } from '@fortawesome/fontawesome-svg-core';

// Import the icons needed here from the kit. for example:
import { faChevronLeft } from '@awesome.me/kit-7993323d0c/icons/classic/solid';
import { faCalendarDays, faCommentHeart, faPrint, faBookOpenCover } from '@awesome.me/kit-7993323d0c/icons/classic/light';
import { faUgMark } from '@awesome.me/kit-7993323d0c/icons/kit/custom';

config.keepOriginalSource = false;
config.autoAddCss = false;

// Add the icons imported above to the library here. for example:
library.add(faChevronLeft);
library.add(faCalendarDays, faCommentHeart, faPrint, faBookOpenCover);
library.add(faUgMark);