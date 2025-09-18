/**
 * Shared profile domain types
 * 
 * This file contains common profile-related interfaces that are shared across multiple components.
 * Component-specific interfaces should remain in their respective component files.
 */

/**
 * Base profile interface with core fields that most profile representations need
 */
export interface BaseProfile {
  __typename?: "NodeProfile";
  id: string;
  title: string;
  path?: string;
  centralLoginId?: string;
  directoryEmail: boolean;
  directoryOffice: boolean;
  directoryPhone: boolean;
  profileJobTitle?: string;
  status?: boolean;
}

/**
 * Profile image/media interface
 */
export interface ProfileImage {
  __typename?: "MediaImage";
  image: {
    alt?: string;
    url: string;
    width?: number;
    height?: number;
  };
}

/**
 * Profile with image support
 */
export interface ProfileWithImage extends BaseProfile {
  profilePicture?: ProfileImage;
  profileFirstName?: string;
  profileLastName?: string;
}

/**
 * Profile unit/department affiliation
 */
export interface ProfileUnit {
  id: string;
  name: string;
  __typename?: string;
}

/**
 * Profile research area
 */
export interface ProfileResearchArea {
  id: string;
  name: string;
}

/**
 * Profile type/category
 */
export interface ProfileType {
  name: string;
}

/**
 * Profile custom links
 */
export interface ProfileCustomLink {
  title: string;
  url: string;
}

/**
 * Profile field (custom field with label/value pair)
 */
export interface ProfileField {
  label?: {
    processed?: string;
  };
  value?: {
    processed?: string;
  };
}

/**
 * Comprehensive profile interface with all possible fields
 */
export interface FullProfile extends ProfileWithImage {
  uniwebId?: string;
  primaryNavigation?: {
    menuName?: string;
  };
  body?: {
    processed?: string;
  };
  customLink?: ProfileCustomLink[];
  profileUnit?: ProfileUnit[];
  profileFields?: ProfileField[];
  profileResearchAreas?: ProfileResearchArea[];
  profileType?: ProfileType | ProfileType[];
  profileSections?: Array<{
    id?: string;
    profilePartLabel?: string;
    profilePartText?: {
      processed?: string;
    };
    uniwebSelect?: {
      name: string;
    };
  }>;
  tags?: Array<{
    id: string;
    name: string;
  }>;
}

/**
 * Simplified profile interface for grid/list displays
 */
export interface ProfileGridItem {
  id: string;
  title: string;
  path: string;
  profileJobTitle?: string;
  profilePicture?: ProfileImage;
  profileFirstName?: string;
  profileLastName?: string;
}

/**
 * Profile search/filter types
 */
export interface ProfileSearchFilters {
  researchArea?: ProfileResearchArea[];
  profileType?: ProfileType[];
  unit?: ProfileUnit[];
}

/**
 * Profile for search results (minimal data needed for search display)
 */
export interface ProfileSearchResult {
  id: string;
  name: string;
  title: string;
  research?: ProfileResearchArea[];
  units?: ProfileUnit[];
  profileType?: ProfileType | ProfileType[];
}
