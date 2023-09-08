class SPARQLQueryDispatcher {
	constructor( endpoint ) {
		this.endpoint = endpoint;
	}

	query( sparqlQuery ) {
		const fullUrl = this.endpoint + '?query=' + encodeURIComponent( sparqlQuery );
		const headers = { 'Accept': 'application/sparql-results+json' };

		return fetch( fullUrl, { headers } ).then( body => body.json() );
	}
}

const endpointUrl = 'https://query.wikidata.org/sparql';
const sparqlQuery = `
SELECT ?item ?label ?article ?description
WITH {
  SELECT *
  WHERE {
    {
    ?item wdt:P31 wd:Q146.
    ?article schema:about ?item ;
      schema:isPartOf <https://en.wikipedia.org/> .
  }
    UNION{
      ?item wdt:P31 wd:Q27120684.
          ?article schema:about ?item ;
      schema:isPartOf <https://en.wikipedia.org/> .

    }
    UNION {
      ?item wdt:P31 wd:Q27303706.
      ?article schema:about ?item ;
  schema:isPartOf <https://en.wikipedia.org/> .

    }
    }
  LIMIT 200
} AS %i
WHERE {
  INCLUDE %i
  SERVICE wikibase:label { 
    bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en" . 
    ?item rdfs:label ?label .
    ?item schema:description ?description .
  }
}
`;

const queryDispatcher = new SPARQLQueryDispatcher( endpointUrl );

function getCat() {
  queryDispatcher.query( sparqlQuery ).then(
    cats => {
      //Choose random cat
      var cat = cats.results.bindings[Math.floor(Math.random() * cats.results.bindings.length)];
      //Update link with cat url
      document.getElementById("get-cat").href = cat.article.value;
    }
  );
}

document.getElementById("get-cat").addEventListener("click", getCat);

getCat();