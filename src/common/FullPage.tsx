import React from "react";

export interface IFullPageProps {
  header?: JSX.Element;
}

const FullPage: React.FC<IFullPageProps> = props => {
  return (
    <section className="hero is-fullheight">
      {props.header && <div className="hero-head">{props.header}</div>}
      <div className="hero-body">
        <div className="container">{props.children}</div>
      </div>
    </section>
  );
};

export default FullPage;
