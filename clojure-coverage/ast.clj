(ns ast
  (:require [clojure.tools.analyzer.jvm :as ana.jvm]
            [clojure.tools.analyzer.passes.jvm.emit-form :as e]))

(defn ast-from-code [code] (ana.jvm/analyze code))

(defn ast-to-code [ast] (e/emit-form ast))