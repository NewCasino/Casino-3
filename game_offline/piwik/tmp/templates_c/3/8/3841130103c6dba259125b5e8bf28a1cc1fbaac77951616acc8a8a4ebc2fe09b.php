<?php

/* @Installation/databaseSetup.twig */
class __TwigTemplate_3841130103c6dba259125b5e8bf28a1cc1fbaac77951616acc8a8a4ebc2fe09b extends Twig_Template
{
    public function __construct(Twig_Environment $env)
    {
        parent::__construct($env);

        // line 1
        $this->parent = $this->loadTemplate("@Installation/layout.twig", "@Installation/databaseSetup.twig", 1);
        $this->blocks = array(
            'content' => array($this, 'block_content'),
        );
    }

    protected function doGetParent(array $context)
    {
        return "@Installation/layout.twig";
    }

    protected function doDisplay(array $context, array $blocks = array())
    {
        $this->parent->display($context, array_merge($this->blocks, $blocks));
    }

    // line 3
    public function block_content($context, array $blocks = array())
    {
        // line 4
        echo "
    <h2>";
        // line 5
        echo twig_escape_filter($this->env, call_user_func_array($this->env->getFilter('translate')->getCallable(), array("Installation_DatabaseSetup")), "html", null, true);
        echo "</h2>

    ";
        // line 7
        if (array_key_exists("errorMessage", $context)) {
            // line 8
            echo "        <div class=\"alert alert-danger\">
            ";
            // line 9
            echo twig_escape_filter($this->env, call_user_func_array($this->env->getFilter('translate')->getCallable(), array("Installation_DatabaseErrorConnect")), "html", null, true);
            echo ":
            ";
            // line 10
            echo (isset($context["errorMessage"]) ? $context["errorMessage"] : $this->getContext($context, "errorMessage"));
            echo "
        </div>
    ";
        }
        // line 13
        echo "
    ";
        // line 14
        if (array_key_exists("form_data", $context)) {
            // line 15
            echo "        ";
            $this->loadTemplate("genericForm.twig", "@Installation/databaseSetup.twig", 15)->display($context);
            // line 16
            echo "    ";
        }
        // line 17
        echo "
";
    }

    public function getTemplateName()
    {
        return "@Installation/databaseSetup.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  65 => 17,  62 => 16,  59 => 15,  57 => 14,  54 => 13,  48 => 10,  44 => 9,  41 => 8,  39 => 7,  34 => 5,  31 => 4,  28 => 3,  11 => 1,);
    }
}
