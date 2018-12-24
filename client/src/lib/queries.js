let submitSearch = (searchValue) => {
    let url = new URL(`${process.env.REACT_APP_url}api/spotify/search`);
    let params = { searchCriteria: searchValue };
    url.search = new URLSearchParams(params);
    return fetch(url)
    .then(resp => {
        return resp.json();
    })
    .then(json => {
        let numResults = json.body.tracks.items.length;
        console.log(JSON.stringify(json.body.tracks.items));
        return { searchResults: `Results found: ${numResults}` , showingResults: true };
    })
    .catch(err => {
        // lol yeah right
    })
};

export default submitSearch;