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
    disjunctiveFacets: ["city", "name", "country", "company"],
    hitsPerPage: 100,
    maxValuesPerFacet: 500,
    attributesToRetrieve: [
      "id",
      "name",
      "city",
      "email",
      "designation",
      "gender",
      "image_url",
      "company",
      "country",
      "lng",
      "lat",
    ],
  }
);

export const getAlgoliaClient = () => algoliaClient;
export const getAlgoliaHelper = () => algoliaHelper;
