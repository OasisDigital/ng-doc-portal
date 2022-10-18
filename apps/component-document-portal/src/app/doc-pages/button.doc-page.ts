import { Component } from '@angular/core';
import {
  NgDocPortalComponentsModule,
  DocPageConfig,
  ComponentPlaygroundConfig,
} from '@oasisdigital/ng-doc-portal';

@Component({
  standalone: true,
  imports: [NgDocPortalComponentsModule],
  template: `
    <cdp-tab-menu>
      <cdp-tab-item title="Overview">
        <h1>Button Component Document Page</h1>
        <button>Example Button</button>

        <p>The button is used to get actions from the user by click</p>

        <textarea cdpCodeSnippet>
          <button>Example Buttons</button>
        </textarea
        >

        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Sed tempus
          urna et pharetra pharetra. Urna id volutpat lacus laoreet non
          curabitur gravida. Odio ut sem nulla pharetra diam. Odio eu feugiat
          pretium nibh. Est ullamcorper eget nulla facilisi etiam dignissim diam
          quis. Rutrum quisque non tellus orci ac auctor augue mauris. Pharetra
          et ultrices neque ornare. Fringilla phasellus faucibus scelerisque
          eleifend donec pretium vulputate. Tristique et egestas quis ipsum
          suspendisse ultrices. Molestie nunc non blandit massa enim. Mauris sit
          amet massa vitae tortor condimentum lacinia quis. Morbi tristique
          senectus et netus. Dui vivamus arcu felis bibendum. Ac tincidunt vitae
          semper quis lectus. Tellus pellentesque eu tincidunt tortor aliquam
          nulla. In arcu cursus euismod quis viverra nibh. Enim ut sem viverra
          aliquet eget sit amet. Purus viverra accumsan in nisl. Sed libero enim
          sed faucibus turpis in eu. Sem integer vitae justo eget magna
          fermentum iaculis eu non. Arcu dictum varius duis at consectetur lorem
          donec massa. Ac turpis egestas integer eget aliquet. Vulputate sapien
          nec sagittis aliquam malesuada bibendum arcu. Lacinia at quis risus
          sed. Vivamus at augue eget arcu dictum varius duis. Odio facilisis
          mauris sit amet massa vitae tortor condimentum lacinia. Tortor id
          aliquet lectus proin nibh nisl condimentum id venenatis. Purus semper
          eget duis at tellus at urna condimentum mattis. Fermentum dui faucibus
          in ornare quam viverra. Et tortor at risus viverra adipiscing. Est
          ullamcorper eget nulla facilisi etiam dignissim diam. Porta nibh
          venenatis cras sed felis. Facilisi etiam dignissim diam quis enim
          lobortis. Id venenatis a condimentum vitae sapien. Id aliquet lectus
          proin nibh nisl condimentum id venenatis a. Mi sit amet mauris commodo
          quis. Non blandit massa enim nec dui nunc mattis. Faucibus in ornare
          quam viverra orci sagittis. Porttitor leo a diam sollicitudin tempor
          id. Est velit egestas dui id ornare arcu odio. Ut aliquam purus sit
          amet luctus venenatis lectus. Risus ultricies tristique nulla aliquet.
          Purus sit amet luctus venenatis lectus magna fringilla. Elementum
          pulvinar etiam non quam lacus suspendisse. Blandit libero volutpat sed
          cras ornare arcu dui vivamus arcu. Diam donec adipiscing tristique
          risus nec feugiat in. Non diam phasellus vestibulum lorem sed risus
          ultricies tristique. Bibendum est ultricies integer quis. Neque ornare
          aenean euismod elementum nisi quis eleifend quam adipiscing. Mattis
          vulputate enim nulla aliquet porttitor lacus. Ut consequat semper
          viverra nam libero justo laoreet sit amet. Potenti nullam ac tortor
          vitae. Ullamcorper eget nulla facilisi etiam dignissim diam quis enim.
          Sapien faucibus et molestie ac feugiat sed lectus vestibulum mattis.
          Faucibus interdum posuere lorem ipsum dolor sit amet consectetur.
          Bibendum at varius vel pharetra. Tellus id interdum velit laoreet id
          donec ultrices. Tristique magna sit amet purus gravida quis blandit
          turpis. Ipsum faucibus vitae aliquet nec ullamcorper. Sit amet mauris
          commodo quis imperdiet massa. Massa tincidunt nunc pulvinar sapien et
          ligula ullamcorper malesuada proin. Viverra nibh cras pulvinar mattis
          nunc sed blandit. Ullamcorper velit sed ullamcorper morbi tincidunt
          ornare massa. At erat pellentesque adipiscing commodo elit. Elementum
          nisi quis eleifend quam adipiscing vitae proin. Id eu nisl nunc mi
          ipsum faucibus vitae. Sit amet massa vitae tortor. Maecenas sed enim
          ut sem viverra aliquet eget sit amet. Faucibus vitae aliquet nec
          ullamcorper. Lorem ipsum dolor sit amet consectetur adipiscing. Eu
          consequat ac felis donec et. Risus pretium quam vulputate dignissim
          suspendisse in. Pellentesque massa placerat duis ultricies lacus sed.
          Et netus et malesuada fames ac turpis egestas maecenas pharetra. Vitae
          congue eu consequat ac. Sem integer vitae justo eget magna fermentum
          iaculis. Arcu ac tortor dignissim convallis aenean et tortor. Nec
          ullamcorper sit amet risus nullam eget. Id interdum velit laoreet id
          donec. Integer enim neque volutpat ac. Odio pellentesque diam volutpat
          commodo sed egestas egestas fringilla. A cras semper auctor neque
          vitae tempus. Eu augue ut lectus arcu bibendum at varius vel pharetra.
          Massa eget egestas purus viverra accumsan in. Tellus rutrum tellus
          pellentesque eu tincidunt. Morbi tristique senectus et netus. Dapibus
          ultrices in iaculis nunc sed augue. Eget lorem dolor sed viverra
          ipsum. Sollicitudin nibh sit amet commodo nulla facilisi. Elementum
          sagittis vitae et leo duis ut diam quam nulla. Ut porttitor leo a
          diam. Tellus id interdum velit laoreet id donec ultrices tincidunt
          arcu. Rhoncus urna neque viverra justo nec. Feugiat in fermentum
          posuere urna nec tincidunt praesent. Pulvinar pellentesque habitant
          morbi tristique senectus et netus. Magnis dis parturient montes
          nascetur ridiculus mus mauris vitae ultricies. Dolor purus non enim
          praesent. Cras tincidunt lobortis feugiat vivamus at augue. Nunc sed
          augue lacus viverra vitae congue. Senectus et netus et malesuada fames
          ac turpis egestas maecenas. Semper eget duis at tellus at urna
          condimentum. Euismod nisi porta lorem mollis aliquam ut. Elementum
          sagittis vitae et leo duis. Tincidunt ornare massa eget egestas.
          Pellentesque pulvinar pellentesque habitant morbi tristique. Vel
          facilisis volutpat est velit egestas dui id. Blandit aliquam etiam
          erat velit scelerisque in dictum non consectetur. Mattis vulputate
          enim nulla aliquet porttitor lacus luctus. Dui id ornare arcu odio.
          Vulputate ut pharetra sit amet aliquam id. Felis eget velit aliquet
          sagittis id. Elit ut aliquam purus sit. Id aliquet risus feugiat in
          ante metus dictum at tempor. Eu nisl nunc mi ipsum. Volutpat blandit
          aliquam etiam erat velit scelerisque. Accumsan lacus vel facilisis
          volutpat est velit egestas dui. Ut porttitor leo a diam sollicitudin
          tempor id eu. Ipsum nunc aliquet bibendum enim facilisis. Aliquam ut
          porttitor leo a diam sollicitudin tempor. Amet commodo nulla facilisi
          nullam. Id faucibus nisl tincidunt eget nullam non nisi est sit.
          Varius duis at consectetur lorem donec massa sapien faucibus et. Diam
          quam nulla porttitor massa id neque. Non blandit massa enim nec dui
          nunc. Netus et malesuada fames ac. Sit amet dictum sit amet. Proin
          libero nunc consequat interdum varius. Semper quis lectus nulla at
          volutpat diam ut. Amet risus nullam eget felis eget nunc. Quam
          pellentesque nec nam aliquam sem et. Euismod quis viverra nibh cras
          pulvinar mattis. Nisi vitae suscipit tellus mauris a. Sit amet justo
          donec enim diam vulputate ut pharetra. Suscipit adipiscing bibendum
          est ultricies integer quis. Praesent semper feugiat nibh sed pulvinar
          proin gravida. Dolor sed viverra ipsum nunc aliquet bibendum enim
          facilisis. Vulputate sapien nec sagittis aliquam malesuada bibendum
          arcu vitae elementum. Mattis ullamcorper velit sed ullamcorper morbi.
          Aliquet bibendum enim facilisis gravida. Ornare aenean euismod
          elementum nisi quis eleifend quam adipiscing vitae. Dictum sit amet
          justo donec enim diam. At tempor commodo ullamcorper a lacus
          vestibulum sed arcu. Eu volutpat odio facilisis mauris sit. Mattis
          aliquam faucibus purus in massa. Maecenas accumsan lacus vel facilisis
          volutpat. Arcu odio ut sem nulla pharetra diam sit amet nisl. Donec ac
          odio tempor orci dapibus ultrices in iaculis. Dapibus ultrices in
          iaculis nunc sed. Massa ultricies mi quis hendrerit dolor. Et magnis
          dis parturient montes nascetur ridiculus mus mauris vitae. Eu
          consequat ac felis donec. Nam aliquam sem et tortor. Elit duis
          tristique sollicitudin nibh. Aliquet porttitor lacus luctus accumsan
          tortor posuere ac ut. Sapien faucibus et molestie ac. Dui faucibus in
          ornare quam. Nunc scelerisque viverra mauris in aliquam sem fringilla
          ut. Donec ac odio tempor orci dapibus ultrices in. Ligula ullamcorper
          malesuada proin libero nunc. Pellentesque elit ullamcorper dignissim
          cras tincidunt lobortis feugiat vivamus at. Turpis egestas integer
          eget aliquet. Libero justo laoreet sit amet. Consequat mauris nunc
          congue nisi vitae. Sit amet cursus sit amet dictum sit. Lorem dolor
          sed viverra ipsum nunc aliquet bibendum. Euismod in pellentesque massa
          placerat duis. Eget est lorem ipsum dolor sit amet. Ac turpis egestas
          maecenas pharetra convallis posuere morbi leo. Nec dui nunc mattis
          enim ut tellus elementum sagittis vitae. Cursus in hac habitasse
          platea dictumst quisque sagittis purus. Volutpat ac tincidunt vitae
          semper quis. Nisl nunc mi ipsum faucibus vitae. Consequat id porta
          nibh venenatis cras sed. Dictum non consectetur a erat. Ut placerat
          orci nulla pellentesque dignissim enim sit amet venenatis. Vestibulum
          mattis ullamcorper velit sed ullamcorper morbi. Vitae tempus quam
          pellentesque nec nam aliquam. Placerat orci nulla pellentesque
          dignissim enim. Dictum non consectetur a erat nam. At varius vel
          pharetra vel. Varius morbi enim nunc faucibus a pellentesque sit amet
          porttitor. Convallis a cras semper auctor neque vitae tempus quam.
          Facilisi cras fermentum odio eu feugiat pretium nibh ipsum consequat.
          Cursus euismod quis viverra nibh cras. Mauris a diam maecenas sed enim
          ut. Dis parturient montes nascetur ridiculus mus. Ipsum consequat nisl
          vel pretium lectus quam id. Sit amet venenatis urna cursus eget nunc.
          Vitae ultricies leo integer malesuada nunc vel risus commodo viverra.
          Pharetra magna ac placerat vestibulum lectus mauris ultrices eros.
          Malesuada fames ac turpis egestas integer eget aliquet. Bibendum est
          ultricies integer quis auctor elit sed vulputate. Vivamus at augue
          eget arcu dictum varius duis at. Lectus mauris ultrices eros in cursus
          turpis massa. Et malesuada fames ac turpis egestas. Pulvinar sapien et
          ligula ullamcorper malesuada proin libero nunc consequat. Scelerisque
          varius morbi enim nunc faucibus. Ut consequat semper viverra nam
          libero justo laoreet. Mauris commodo quis imperdiet massa tincidunt
          nunc pulvinar. Adipiscing tristique risus nec feugiat in fermentum
          posuere. Mattis enim ut tellus elementum sagittis vitae et. Morbi
          tincidunt augue interdum velit euismod in pellentesque. Hac habitasse
          platea dictumst quisque. Tristique senectus et netus et malesuada
          fames ac turpis egestas. Aliquam vestibulum morbi blandit cursus risus
          at ultrices mi tempus. Viverra justo nec ultrices dui. Urna nunc id
          cursus metus aliquam eleifend mi in. Amet volutpat consequat mauris
          nunc congue nisi vitae suscipit tellus. Facilisi etiam dignissim diam
          quis enim lobortis scelerisque fermentum. Senectus et netus et
          malesuada fames ac turpis egestas. Dignissim sodales ut eu sem integer
          vitae justo eget magna. Tellus mauris a diam maecenas sed enim ut sem.
          Egestas tellus rutrum tellus pellentesque eu tincidunt tortor aliquam.
          Malesuada bibendum arcu vitae elementum curabitur vitae nunc sed
          velit. Lectus magna fringilla urna porttitor rhoncus dolor. Ac odio
          tempor orci dapibus ultrices in iaculis nunc. Purus viverra accumsan
          in nisl. Mauris augue neque gravida in fermentum et. Suscipit
          adipiscing bibendum est ultricies integer quis auctor. Tempor id eu
          nisl nunc mi ipsum faucibus. A iaculis at erat pellentesque adipiscing
          commodo. Porta lorem mollis aliquam ut porttitor leo a diam
          sollicitudin. Magna fermentum iaculis eu non diam phasellus
          vestibulum. Blandit volutpat maecenas volutpat blandit aliquam. Sed
          felis eget velit aliquet sagittis id consectetur purus ut. Proin
          fermentum leo vel orci porta non. At tempor commodo ullamcorper a.
          Arcu non odio euismod lacinia at quis risus sed vulputate. Dolor magna
          eget est lorem ipsum dolor sit amet consectetur. Id velit ut tortor
          pretium viverra suspendisse potenti nullam. Diam sollicitudin tempor
          id eu nisl nunc mi ipsum faucibus. Sagittis purus sit amet volutpat
          consequat mauris nunc. Diam quis enim lobortis scelerisque fermentum
          dui faucibus in. Dignissim diam quis enim lobortis scelerisque.
          Habitant morbi tristique senectus et. Commodo quis imperdiet massa
          tincidunt nunc pulvinar sapien. Nunc non blandit massa enim nec dui
          nunc mattis. Tincidunt eget nullam non nisi est sit amet. Eget felis
          eget nunc lobortis mattis aliquam faucibus purus in. Ac turpis egestas
          sed tempus urna et. Pellentesque elit eget gravida cum. Dolor morbi
          non arcu risus quis varius quam. Arcu dictum varius duis at
          consectetur lorem donec massa sapien. A lacus vestibulum sed arcu non
          odio euismod lacinia at. Venenatis urna cursus eget nunc. Accumsan in
          nisl nisi scelerisque eu. Ut diam quam nulla porttitor. In iaculis
          nunc sed augue. Purus viverra accumsan in nisl nisi scelerisque eu
          ultrices. Aenean et tortor at risus. Ac turpis egestas sed tempus urna
          et. Netus et malesuada fames ac turpis egestas integer eget. Massa
          placerat duis ultricies lacus sed turpis tincidunt. Sit amet aliquam
          id diam maecenas ultricies mi eget. Bibendum at varius vel pharetra
          vel turpis nunc. Justo donec enim diam vulputate ut pharetra sit amet
          aliquam. Lectus mauris ultrices eros in cursus turpis. Et malesuada
          fames ac turpis egestas sed tempus. Vivamus at augue eget arcu dictum
          varius duis at consectetur. Fermentum iaculis eu non diam phasellus
          vestibulum. Gravida arcu ac tortor dignissim convallis aenean et
          tortor. Varius morbi enim nunc faucibus a pellentesque sit amet
          porttitor. Maecenas sed enim ut sem viverra aliquet eget. Egestas erat
          imperdiet sed euismod nisi. Congue mauris rhoncus aenean vel elit.
          Maecenas pharetra convallis posuere morbi leo urna molestie at
          elementum. Volutpat ac tincidunt vitae semper quis lectus. Laoreet id
          donec ultrices tincidunt arcu non sodales neque sodales. Viverra vitae
          congue eu consequat ac felis donec et odio. Praesent semper feugiat
          nibh sed pulvinar proin gravida. Mattis rhoncus urna neque viverra
          justo nec. Maecenas ultricies mi eget mauris pharetra et ultrices
          neque. Risus quis varius quam quisque id diam vel. Urna et pharetra
          pharetra massa massa ultricies. Scelerisque felis imperdiet proin
          fermentum leo vel orci. At ultrices mi tempus imperdiet nulla. Proin
          sagittis nisl rhoncus mattis rhoncus urna. Massa eget egestas purus
          viverra accumsan in nisl nisi. Integer enim neque volutpat ac
          tincidunt vitae semper quis lectus. Tempus urna et pharetra pharetra
          massa massa ultricies mi quis. Sapien faucibus et molestie ac feugiat
          sed lectus vestibulum. Tempor id eu nisl nunc mi ipsum faucibus vitae.
          Pharetra diam sit amet nisl suscipit adipiscing. Sollicitudin aliquam
          ultrices sagittis orci a scelerisque. Suspendisse interdum consectetur
          libero id faucibus nisl tincidunt eget nullam. Tellus molestie nunc
          non blandit massa enim nec dui nunc. Pellentesque pulvinar
          pellentesque habitant morbi tristique senectus et. Facilisi nullam
          vehicula ipsum a. At elementum eu facilisis sed odio morbi quis
          commodo. Adipiscing tristique risus nec feugiat in fermentum.
          Scelerisque eleifend donec pretium vulputate sapien nec sagittis
          aliquam malesuada. Nec feugiat in fermentum posuere urna. Et ultrices
          neque ornare aenean euismod elementum nisi. Pulvinar sapien et ligula
          ullamcorper malesuada proin libero nunc consequat. Et tortor at risus
          viverra adipiscing. Senectus et netus et malesuada fames. Quis lectus
          nulla at volutpat diam ut venenatis. Interdum consectetur libero id
          faucibus nisl tincidunt eget nullam non. Lacinia at quis risus sed
          vulputate odio. Tellus at urna condimentum mattis pellentesque id.
          Eget felis eget nunc lobortis mattis. Turpis in eu mi bibendum neque
          egestas. Scelerisque purus semper eget duis. In cursus turpis massa
          tincidunt dui ut ornare lectus sit. A iaculis at erat pellentesque
          adipiscing. Odio ut sem nulla pharetra diam sit amet. Donec et odio
          pellentesque diam. Sit amet porttitor eget dolor morbi non arcu risus
          quis. Elementum facilisis leo vel fringilla est. Non odio euismod
          lacinia at. Et netus et malesuada fames. Vel risus commodo viverra
          maecenas accumsan lacus vel. Ullamcorper morbi tincidunt ornare massa.
          Tellus elementum sagittis vitae et. Morbi tristique senectus et netus
          et malesuada. Lectus nulla at volutpat diam ut venenatis tellus in. Ut
          tortor pretium viverra suspendisse potenti.
        </p>
      </cdp-tab-item>
      <cdp-tab-item title="Playground">
        <cdp-playground [config]="playgroundConfig"></cdp-playground>
      </cdp-tab-item>
    </cdp-tab-menu>
  `,
})
export class ButtonDocumentPageComponent {
  playgroundConfig: ComponentPlaygroundConfig = {
    component: ButtonComponent,
    textContentBinding: { default: 'Hello World!' },
    classBinding: {
      classes: ['foo', 'bar', 'baz', 'test', 'test2', 'test3'],
      multiple: true,
    },
  };
}

const docPageConfig: DocPageConfig = {
  title: 'General/Button',
  docPageComponent: ButtonDocumentPageComponent,
};

export default docPageConfig;

@Component({
  selector: 'app-custom-button',
  template: ` <button><ng-content></ng-content></button> `,
})
export class ButtonComponent {}
