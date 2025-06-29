(ns reader)

(defn read-code! [filename] (-> filename slurp (#(str "[" % "]")) read-string))
