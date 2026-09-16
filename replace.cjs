const fs = require('fs');
const path = 'c:/Users/amahd/OneDrive/Documents/Code/WordPix/src/app/core/ExploreWorlds.tsx';
let text = fs.readFileSync(path, 'utf8');

const oldFilteredModules = `  const filteredModules = useMemo(() => {
    let modules = COURSE_MODULES;
    if (selectedModuleId !== "all") {
      modules = modules.filter((m) => m.id === selectedModuleId);
    }

    if (!searchQuery.trim()) {
      return modules;
    }

    const q = searchQuery.toLowerCase().trim();
    return modules
      .map((mod) => {
        const matchingUnitIds = mod.unitIds.filter((uid) => {
          const unit = COURSE_UNITS[uid];
          if (!unit) return false;
          return (
            unit.name.toLowerCase().includes(q) ||
            unit.description.toLowerCase().includes(q) ||
            // Word ids are the label slugged — "bathtub" for "Bathtub" — for
            // 10,826 of the 10,848 items, so they carry search without the
            // labels themselves being in the bundle. The exceptions are
            // accented words: searching "rosé" misses where "rose" matches.
            unit.wordIds.some((id) => id.replace(/-/g, " ").includes(q))
          );
        });

        if (matchingUnitIds.length === 0 && !mod.title.toLowerCase().includes(q)) {
          return null;
        }

        return {
          ...mod,
          unitIds: matchingUnitIds.length > 0 ? matchingUnitIds : mod.unitIds,
        };
      })
      .filter((mod): mod is CourseModule => mod !== null);
  }, [searchQuery, selectedModuleId]);`;

const newFilteredModules = `  const filterModulesByQuery = (modules: CourseModule[], q: string) => {
    if (!q.trim()) return modules;
    const lowerQ = q.toLowerCase().trim();
    return modules.map((mod) => {
      const matchingUnitIds = mod.unitIds.filter((uid) => {
        const unit = COURSE_UNITS[uid];
        if (!unit) return false;
        return (
          unit.name.toLowerCase().includes(lowerQ) ||
          unit.description.toLowerCase().includes(lowerQ) ||
          unit.wordIds.some((id) => id.replace(/-/g, " ").includes(lowerQ))
        );
      });
      if (matchingUnitIds.length === 0 && !mod.title.toLowerCase().includes(lowerQ)) {
        return null;
      }
      return {
        ...mod,
        unitIds: matchingUnitIds.length > 0 ? matchingUnitIds : mod.unitIds,
      };
    }).filter((mod): mod is CourseModule => mod !== null);
  };

  const filteredModules = useMemo(() => {
    let modules = COURSE_MODULES.filter(m => !m.isSpecialSection);
    if (selectedModuleId !== "all") {
      modules = modules.filter((m) => m.id === selectedModuleId);
    }
    return filterModulesByQuery(modules, searchQuery);
  }, [searchQuery, selectedModuleId]);

  const filteredSpecialModules = useMemo(() => {
    let modules = COURSE_MODULES.filter(m => m.isSpecialSection);
    return filterModulesByQuery(modules, searchQuery);
  }, [searchQuery]);`;

text = text.replace(oldFilteredModules, newFilteredModules);

text = text.replace('{COURSE_MODULES.length}', '{COURSE_MODULES.filter(m => !m.isSpecialSection).length}');
text = text.replace('COURSE_MODULES.map((mod) => {', 'COURSE_MODULES.filter(m => !m.isSpecialSection).map((mod) => {');
text = text.replace('<span>{mod.level === 99 ? mod.title : t("explore.levelTab", { level: mod.level })}</span>', '<span>{t("explore.levelTab", { level: mod.level })}</span>');

const mapStartString = '          filteredModules.map((module) => {';
const mapEndString = '                    </motion.div>\r\n                  )}\r\n                </AnimatePresence>\r\n              </motion.section>\r\n            );\r\n          })\r\n        )}\r\n      </div>\r\n    </motion.div>\r\n  );\r\n});';

let partsStart = text.split(mapStartString);
if (partsStart.length === 2) {
    let partsEnd = partsStart[1].split(mapEndString);
    if (partsEnd.length !== 2) {
        // Try with \n instead of \r\n
        const mapEndStringLF = mapEndString.replace(/\r\n/g, '\n');
        partsEnd = partsStart[1].split(mapEndStringLF);
    }

    if (partsEnd.length === 2) {
        const mapBody = partsEnd[0];
        
        const newJsx = `          (() => {
            const renderModule = (module: CourseModule) => {${mapBody}                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.section>
            );
            };

            return (
              <>
                {filteredModules.map(renderModule)}
                {filteredSpecialModules.length > 0 && (
                  <div className="mt-8 pt-8 border-t-2 border-border/50 flex flex-col gap-8 relative">
                    <div className="absolute -top-0.5 left-4 right-4 h-0.5 bg-border rounded-full opacity-50" />
                    {filteredSpecialModules.map(renderModule)}
                  </div>
                )}
              </>
            );
          })()}
        )}
      </div>
    </motion.div>
  );
});`;

        text = partsStart[0] + newJsx + partsEnd[1];
        fs.writeFileSync(path, text, 'utf8');
        console.log("Replacement successful!");
    } else {
        console.log("Failed to find end boundary");
    }
} else {
    console.log("Failed to find start boundary");
}
