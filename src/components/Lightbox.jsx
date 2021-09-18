import { Modal } from "react-bootstrap";
import "./Lightbox.scss";
import all_quotes from "../assets/data/quotes.json";

export default function Lightbox(props) {
  const { onHide, image, category } = props,
    match_quotes = all_quotes.filter(el => el.Category === category),
    selected_quote = match_quotes[Math.floor(Math.random() * match_quotes.length)];

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onClick={onHide}
    >
      <Modal.Body>
        <div className="modal-body__content">
          <img src={image} alt="lightbox" />
        </div>
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <div>
          <h1>{category?.split('').join('⋅')}</h1>
          <p>{selected_quote?.Quote}</p>
          <cite>{selected_quote?.Author}</cite>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
