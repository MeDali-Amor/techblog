import Head from "/next/head";

const Metatags = ({ title, description, image }) => {
    return (
        <Head>
            <title>{title}</title>
            <div>
                <meta property="og:title" content={title} />
                <meta property="og:image" content={image} />
                <meta property="og:description" content={description} />
                {/* <meta name="og:url" content="" /> */}
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content={image} />
            </div>
        </Head>
    );
};

export default Metatags;
