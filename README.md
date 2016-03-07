SummernoteBundle
==================

SummernoteBundle adds [summernote](https://github.com/summernote/summernote) bundle


| StyleCI | Downloads | Version | License |
|---------|-----------|---------|---------|
|[![StyleCI](https://styleci.io/repos/44318975/shield)](https://styleci.io/repos/44318975)|[![Total Downloads](https://poser.pugx.org/adnedelcu/summernote-bundle/downloads)](https://packagist.org/packages/adnedelcu/summernote-bundle)|[![Latest Stable Version](https://poser.pugx.org/adnedelcu/summernote-bundle/v/stable)](https://packagist.org/packages/adnedelcu/summernote-bundle)|[![License](https://poser.pugx.org/adnedelcu/summernote-bundle/license)](https://packagist.org/packages/adnedelcu/summernote-bundle)|


## Installation


### Step 1: Installation

Using Composer, just add the following configuration to your `composer.json`:

Or you can use composer to install this bundle:
Add SummernoteBundle in your composer.json:

```sh
    composer require adnedelcu/summernote-bundle
```

Now tell composer to download the bundle by running the command:

```sh
    composer update adnedelcu/summernote-bundle
```

### Step 2: Enable the bundle

Finally, enable the bundle in the kernel:

``` php
<?php
// app/AppKernel.php

public function registerBundles()
{
    $bundles = array(
        // ...
        new ADN\SummernoteBundle\SummernoteBundle(),
    );
}
```

## Configuration

You can configure bundle as follows

```yaml
adn_summernote:
    plugins:
        - video
    selector: .summernote #defines summernote selector for apply to
    toolbar: # define toolbars, if no toolbar configured, default toolbars defined
        ['style', ['style']]
    extra_toolbar: # extra toolbar can be used for plugins toolbar and as additional toolbar setings, when 'toolbar' option is omitted
        elfinder: [elfinder]
    width: 600
    height: 400
    include_jquery: true #include js libraries, if your template already have them, set to false
    include_bootstrap: true
    include_fontawesome: true

```

##Usage

Twig template example

```twig
    {{ summernote_init() }}
    <textarea class="summernote"></textarea>
```
