import React from 'react';


export default function Event({ match }) {
  return <h1>Event: {match.params.id}</h1>;
}
