import React from 'react';
import _ from 'underscore';

import Client from '../github-client';
import Loadable from './loadable.jsx';

const InnerMarkdown = React.createClass({
  displayName: 'InnerMarkdown',
  updateLinks() {
    const links = this.getDOMNode().querySelectorAll('a');
    _.each(links, (link) => {
      link.setAttribute('target', '_blank');
    });
  },
  componentDidMount() {
    this.updateLinks();
  },
  componentDidUpdate() {
    this.updateLinks();
  },
  render() {
    const {html} = this.props;

    return (
      <div className='rendered-markdown' dangerouslySetInnerHTML={{__html: html}} />
    );
  }

});

export default React.createClass({
  displayName: 'GithubFlavoredMarkdown',
  getPromise() {
    const {text, repoOwner, repoName} = this.props;
    const context = repoOwner + '/' + repoName;
    const isRaw = true;
    const HACK = JSON.stringify({text: text, context: context, mode: 'gfm'});
    return Client.getOcto().markdown.create(HACK, isRaw);
  },
  render() {
    return (
      <Loadable
        promise={this.getPromise()}
        renderLoaded={(html) => {
          return (
            <InnerMarkdown html={html} />
          );
        }}
      />
    );
  }
});