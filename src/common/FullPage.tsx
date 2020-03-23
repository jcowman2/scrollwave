import React from "react";

export interface IFullPageProps {}

const FullPage: React.FC<IFullPageProps> = props => {
  return (
    <section className="hero is-fullheight">
      <div className="hero-body">
        <div className="container">{props.children}</div>
      </div>
    </section>
  );
};

export default FullPage;
