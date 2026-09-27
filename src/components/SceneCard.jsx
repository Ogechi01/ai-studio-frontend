// Shows one scene: number, title, what we see, and what is said
function SceneCard({ scene }) {
  const lines = scene.dialogue
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const noDialogue = lines.length === 0 || /^\(no dialogue\)$/i.test(lines[0]);

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white">
          {scene.sceneNumber}
        </span>
        <h3 className="text-lg font-semibold text-gray-900">
          {scene.title || `Scene ${scene.sceneNumber}`}
        </h3>
      </div>

      <p className="mb-4 leading-relaxed text-gray-700">{scene.description}</p>

      <div className="rounded-lg bg-gray-50 p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Dialogue
        </p>

        {noDialogue ? (
          <p className="italic text-gray-400">No dialogue</p>
        ) : (
          <ul className="space-y-1">
            {lines.map((line, index) => {
              const colon = line.indexOf(":");
              const hasName = colon > 0 && colon < 30;

              return (
                <li key={index} className="text-gray-800">
                  {hasName ? (
                    <>
                      <span className="font-semibold">{line.slice(0, colon)}:</span>
                      {line.slice(colon + 1)}
                    </>
                  ) : (
                    line
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </article>
  );
}

export default SceneCard;
