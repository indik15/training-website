function Morphology() {
  return (
    <main className="container px-4 py-4">
      <article>
        <section>
          <h3 className="h3 text-success">Зовнішній вигляд</h3>
          <p>Лами – це середнього розміру тварини з густою, м'якою шерстю, яка може мати різне забарвлення. Вони мають довгу шию, великі виразні очі та загострені вуха, які можуть рухатися в різні боки. Лами відомі своєю витривалістю та здатністю адаптуватися до високогірних умов Анд.</p>
        </section>
        <section>
          <h3 className="h3 text-success">Особливості будови</h3>
          <ul>
          <li>Висота дорослого самця в холці до 120 см.</li>
          <li>Шия довга і тонка, голова відносно мала, звичайно високо піднята, вуха високі, загострені.</li>
          <li>Незважаючи на відсутність горба, у лам багато спільних рис з верблюдами.</li>
          </ul>
        </section>
        <figure className="text-center">
          <img src="https://s3.animalia.bio/animals/photos/full/original/llama-8.webp" alt="Лами на лузі" className="img-fluid rounded my-4"/>
          <figcaption className="text-muted">Молода лама</figcaption>
        </figure>
      </article>
    </main>
  );
}

export default Morphology;