import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav>
      <Link to="/"> </Link> |
      <Link to="/admin"></Link> |
      <Link to="/orders"></Link>
    </nav>
  );
}


