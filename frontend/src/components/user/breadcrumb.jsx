import { Link } from "react-router-dom";

const UserBreadcrumb = ({ items }) => {
    return (
        <nav className="w-full pt-24 pb-1 lg:block hidden">
            <ol className="list-reset flex">
                {items.map((item, index) => (
                    <li key={index}
                        style={{
                            fontSize: 13,
                            fontWeight: 500,
                        }}
                        className="flex items-center cursor-pointer">
                        {item.path ? (
                            <Link to={item.path} className="text-gray-200 transition duration-150 ease-in-out hover:text-gray-100 "
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-gray-200 transition duration-150 ease-in-out hover:text-gray-100 ">
                                {item.label}
                            </span>
                        )}
                        {index < items.length - 1 && <span className="">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M10.02 6L8.61 7.41L13.19 12l-4.58 4.59L10.02 18l6-6l-6-6z" /></svg>
                        </span>}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
export default UserBreadcrumb;