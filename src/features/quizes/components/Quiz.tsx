const Quiz = () => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        console.log("FORM SUBMIT PREVENTED");
        setTimeout(() => alert("No reload!"), 500);
      }}
    >
      <input name="name" placeholder="Category" />
      <button type="submit">Submit</button>
    </form>
  );
};

export default Quiz;
