import { PortableTextComponents } from '@portabletext/react';

export const CustomPortableTextComponents: PortableTextComponents = {
    block: {
        normal: ({ children }) => <p className="text-normal">{children}</p>,
        small: ({ children }) => <p className="text-small">{children}</p>,
        large: ({ children }) => <p className="text-large">{children}</p>,
        h3: ({ children }) => <h3>{children}</h3>,
        h4: ({ children }) => <h4>{children}</h4>,
        h5: ({ children }) => <h5>{children}</h5>,
        h6: ({ children }) => <h6>{children}</h6>,
        blockquote: ({ children }) => <blockquote>{children}</blockquote>,
    },
    marks: {
        strong: ({ children }) => <strong>{children}</strong>,
        em: ({ children }) => <em>{children}</em>,
        code: ({ children }) => <code>{children}</code>,
    },
    list: {
        bullet: ({ children }) => <ul className="list-disc pl-5 my-4">{children}</ul>,
        number: ({ children }) => <ol className="list-decimal pl-5 my-4">{children}</ol>,
    },
};
