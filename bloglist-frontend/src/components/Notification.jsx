const Notification = ({ info }) => {
  if (info.message === null) return;

  const style = {
    color: info.type === "info" ? "green" : "red",
    borderStyle: "solid",
    backgroundColor: "lightgrey",
    fontSize: "1.15rem",
    borderRadius: 5,
    padding: "7px 14px",
    marginBottom: "10px",
  };

  return <p style={style}>{info.message}</p>;
};

export default Notification;
