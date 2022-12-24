import algoliaSearch from "algoliasearch/lite";
import algoliaSearchHelper from "algoliasearch-helper";

const algoliaClient = algoliaSearch(
  import.meta.env.VITE_ALGOLIA_APP_ID as string,
  import.meta.env.VITE_ALGOLIA_SEARCH_API_KEY as string
);

const algoliaHelper = algoliaSearchHelper(
  algoliaClient,
  import.meta.env.VITE_ALGOLIA_INDEX_NAME as string,
  {
    disjunctiveFacets: ["city", "username", "skills"],
    hitsPerPage: 7,
    maxValuesPerFacet: 20,
    attributesToRetrieve: [
      "id",
      "name",
      "username",
      "city",
      "email",
      "designation",
      "gender",
      "image_url",
      "skills",
      "color",
      "date",
      "_geoloc",
    ],
  }
);

export const getAlgoliaClient = () => algoliaClient;
export const getAlgoliaHelper = () => algoliaHelper;
