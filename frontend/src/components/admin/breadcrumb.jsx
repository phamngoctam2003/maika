import { Link } from "react-router-dom";

const Breadcrumb = ({ items }) => {
    return (
        <nav className="w-full my-2 p-2 h-full">
            <ol className="list-reset flex">
                {items.map((item, index) => (
                    <li key={index} className="flex items-center">
                        {item.path ? (
                            <Link to={item.path} className="underline text-blue-600 transition duration-150 ease-in-out hover:text-blue-800 "
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-neutral-500 dark:text-neutral-400">
                                {item.label}
                            </span>
                        )}
                        {index < items.length - 1 && <span className="px-1"> / </span>}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
export default Breadcrumb;